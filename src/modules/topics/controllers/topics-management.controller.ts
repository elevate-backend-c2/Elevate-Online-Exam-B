import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Topic } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { UpdateTopicDto } from '../dtos/update-topic.dto';
import { TopicsManagementService } from '../services/topics-management.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { DiplomaAccess } from '../../auth/decorators/diploma-access.decorator';

@ApiTags('topics-admin')
@ApiBearerAuth('access-token')
@Controller({
  path: 'admin/topics',
  version: '1',
})
export class TopicsManagementController {
  constructor(
    private readonly topicsManagementService: TopicsManagementService,
  ) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'body', key: 'diplomaId' })
  @Post()
  createTopic(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicsManagementService.createTopic(createTopicDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'body', key: 'diplomaId' })
  @Patch(':topicId')
  updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    return this.topicsManagementService.updateTopic(topicId, updateTopicDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':topicId')
  deleteTopic(@Param('topicId') topicId: string): Promise<void> {
    return this.topicsManagementService.deleteTopic(topicId);
  }
}
