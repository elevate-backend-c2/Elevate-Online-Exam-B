import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Topic } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { UpdateTopicDto } from '../dtos/update-topic.dto';
import { Diploma } from '../../diplomas/schemas/diploma.schema';

@Injectable()
export class TopicsManagementService {
  constructor(
    @InjectModel(Topic.name)
    private topicModel: Model<Topic>,
    @InjectModel(Diploma.name)
    private diplomaModel: Model<Diploma>,
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true }) as string;
  }

  async createTopic(createTopicDto: CreateTopicDto): Promise<Topic> {
    const { diplomaId } = createTopicDto;

    const diploma = await this.diplomaModel.findById(diplomaId).select('_id');
    if (!diploma) {
      throw new NotFoundException('Diploma not found');
    }

    const slug = this.generateSlug(createTopicDto.name);
    const topic = new this.topicModel({
      ...createTopicDto,
      slug,
    });
    return topic.save();
  }

  async updateTopic(
    id: string,
    updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    type TopicUpdateData = UpdateTopicDto & { slug?: string };
    const updateData: TopicUpdateData = { ...updateTopicDto };

    if (updateTopicDto.diplomaId) {
      const diploma = await this.diplomaModel
        .findById(updateTopicDto.diplomaId)
        .select('_id');
      if (!diploma) {
        throw new NotFoundException('Diploma not found');
      }
    }

    if (updateTopicDto.name) {
      updateData.slug = this.generateSlug(updateTopicDto.name);
    }

    const topic = await this.topicModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    return topic;
  }

  async deleteTopic(id: string): Promise<void> {
    const result = await this.topicModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Topic not found');
    }
  }
}
