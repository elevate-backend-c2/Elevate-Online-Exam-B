import { Controller, Get, Param } from '@nestjs/common';
import { Topic } from '../schemas/topic.schema';
import { TopicsService } from '../services/topics.service';

@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/diplomas/:diplomaId/topics')
  getDiplomaTopics(@Param('diplomaId') diplomaId: string): Promise<Topic[]> {
    return this.topicsService.findTopicsByDiplomaId(diplomaId);
  }
}
