import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Topic } from '../schemas/topic.schema';
import { TopicsService } from '../services/topics.service';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('topics')
@Controller({
  path: 'diplomas',
  version: '1',
})
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Public()
  @Get(':diplomaId/topics')
  getDiplomaTopics(@Param('diplomaId') diplomaId: string): Promise<Topic[]> {
    return this.topicsService.findTopicsByDiplomaId(diplomaId);
  }
}
