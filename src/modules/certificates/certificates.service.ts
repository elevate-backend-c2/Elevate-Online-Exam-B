import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certificate } from './schemas/certificate.schema';
import { User } from '../users/schemas/user.schema';
import { Quiz } from '../quizzes/schemas/quiz.schema';
import { PdfService } from '../../common/pdf/pdf.service';
import type { CertificateListItem } from './types/certificate-list-item.type';
import type { PaginatedCertificatesResponse } from './types/paginated-certificates-response.type';

interface IssuedCertificateResult {
  certificate: Certificate & { id: string };
  pdfBase64: string;
}

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<Quiz>,
    private readonly pdfService: PdfService,
  ) {}

  private generateCertificateCode(): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString(36).toUpperCase();
    return `CERT-${timestampPart}-${randomPart}`;
  }

  async issueCertificateForQuizAttempt(
    userId: Types.ObjectId,
    quizId: Types.ObjectId,
    issuedAt: Date,
  ): Promise<IssuedCertificateResult> {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found for certificate');
    }
    const quiz = await this.quizModel.findById(quizId).lean().exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found for certificate');
    }

    const existing = await this.certificateModel
      .findOne({ userId, quizId })
      .lean()
      .exec();
    if (existing) {
      const { _id, ...rest } = existing as Certificate & {
        _id: Types.ObjectId | string;
      };
      return {
        certificate: { ...rest, id: _id.toString() },
        pdfBase64: '',
      };
    }

    const certificateCode = this.generateCertificateCode();

    const certificateDoc = await this.certificateModel.create({
      userId,
      quizId,
      certificateCode,
      issuedAt,
    });
    const certificateObject = certificateDoc.toObject() as Certificate & {
      _id?: Types.ObjectId | string;
    };

    const pdfBuffer = await this.pdfService.generateCertificate({
      studentName: (user as any).name ?? (user as any).email ?? 'Student',
      courseName: (quiz as any).title ?? 'Course',
      date: issuedAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      certificateId: certificateCode,
    });

    return {
      certificate: {
        ...certificateObject,
        id: certificateObject._id ? certificateObject._id.toString() : '',
      },
      pdfBase64: pdfBuffer.toString('base64'),
    };
  }

  async getUserCertificates(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedCertificatesResponse> {
    const userObjectId = new Types.ObjectId(userId);

    const [certificates, total] = await Promise.all([
      this.certificateModel
        .find({ userId: userObjectId })
        .sort({ issuedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.certificateModel.countDocuments({ userId: userObjectId }).exec(),
    ]);

    const items: CertificateListItem[] = certificates.map((cert) => {
      const certificateId =
        (cert as Certificate & { _id?: Types.ObjectId | string })._id;
      return {
        id: certificateId ? certificateId.toString() : '',
        code: cert.certificateCode,
        quizId: cert.quizId.toString(),
        issuedAt: cert.issuedAt,
      };
    });

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async getCertificatePdfForUser(
    certificateId: string,
    userId: string,
  ): Promise<{ id: string; code: string; pdfBase64: string }> {
    const userObjectId = new Types.ObjectId(userId);
    const certificate = await this.certificateModel
      .findOne({ _id: new Types.ObjectId(certificateId), userId: userObjectId })
      .lean()
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const user = await this.userModel.findById(userObjectId).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found for certificate');
    }

    const quiz = await this.quizModel
      .findById(certificate.quizId)
      .lean()
      .exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found for certificate');
    }

    const issuedAt = certificate.issuedAt ?? new Date();

    const pdfBuffer = await this.pdfService.generateCertificate({
      studentName: (user as any).name ?? (user as any).email ?? 'Student',
      courseName: (quiz as any).title ?? 'Course',
      date: issuedAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      certificateId: certificate.certificateCode,
    });

    return {
      id: certificate._id?.toString(),
      code: certificate.certificateCode,
      pdfBase64: pdfBuffer.toString('base64'),
    };
  }
}

