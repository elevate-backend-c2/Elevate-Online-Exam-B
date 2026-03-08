import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Topic } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { UpdateTopicDto } from '../dtos/update-topic.dto';
import { TopicsManagementService } from '../services/topics-management.service';

@Controller('/admin/topics')
export class TopicsManagementController {
  constructor(
    private readonly topicsManagementService: TopicsManagementService,
  ) {}

  @Post()
  createTopic(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicsManagementService.createTopic(createTopicDto);
  }

  @Patch(':topicId')
  updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    return this.topicsManagementService.updateTopic(topicId, updateTopicDto);
  }

  @Delete(':topicId')
  deleteTopic(@Param('topicId') topicId: string): Promise<void> {
    return this.topicsManagementService.deleteTopic(topicId);
  }
}
