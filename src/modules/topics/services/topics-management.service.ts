import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Topic } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { UpdateTopicDto } from '../dtos/update-topic.dto';

@Injectable()
export class TopicsManagementService {
  constructor(
    @InjectModel(Topic.name)
    private topicModel: Model<Topic>,
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async createTopic(createTopicDto: CreateTopicDto): Promise<Topic> {
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
