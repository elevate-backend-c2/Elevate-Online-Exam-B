import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import type { Request } from 'express';
import { Model, Types } from 'mongoose';
import type { RequestWithUser } from '../types/request-with-user.type';
import {
  DIPLOMA_ACCESS_KEY,
  DiplomaAccessMetadata,
} from '../decorators/diploma-access.decorator';
import { UserRole } from '../enums/user-role.enum';
import { Quiz } from '../../quizzes/schemas/quiz.schema';
import { Topic } from '../../topics/schemas/topic.schema';

@Injectable()
export class DiplomaAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<Quiz>,
    @InjectModel(Topic.name)
    private readonly topicModel: Model<Topic>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<DiplomaAccessMetadata | undefined>(
      DIPLOMA_ACCESS_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    const diplomaId = await this.resolveDiplomaId(metadata, request);

    if (!diplomaId) {
      return true;
    }

    const allowed = (user.allowedDiplomas ?? []).map((id) => id.toString());

    if (!allowed.includes(diplomaId)) {
      throw new ForbiddenException('You are not allowed to manage this diploma');
    }

    return true;
  }

  private async resolveDiplomaId(
    metadata: DiplomaAccessMetadata,
    request: Request,
  ): Promise<string | null> {
    if (metadata.source === 'param') {
      const raw = (request.params as Record<string, string | undefined>)[
        metadata.key
      ];
      return raw ?? null;
    }

    if (metadata.source === 'body') {
      const body = request.body as Record<string, unknown>;
      const raw = body[metadata.key];
      return typeof raw === 'string' ? raw : null;
    }

    if (metadata.source === 'topicBody') {
      const body = request.body as Record<string, unknown>;
      const raw = body[metadata.key];
      if (typeof raw !== 'string') return null;

      const topic = await this.topicModel
        .findById(raw)
        .select('diplomaId')
        .lean<Pick<Topic, 'diplomaId'>>()
        .exec();
      if (!topic?.diplomaId) return null;
      const diplomaObjectId = topic.diplomaId as unknown as Types.ObjectId;
      return diplomaObjectId.toHexString();
    }

    if (metadata.source === 'quizParam') {
      const quizId = (request.params as Record<string, string | undefined>)[
        metadata.key
      ];
      if (!quizId) return null;
      const quiz = await this.quizModel
        .findById(quizId)
        .select('diplomaId')
        .lean<Pick<Quiz, 'diplomaId'>>()
        .exec();
      if (!quiz?.diplomaId) return null;
      const diplomaObjectId = quiz.diplomaId as unknown as Types.ObjectId;
      return diplomaObjectId.toHexString();
    }

    return null;
  }
}

