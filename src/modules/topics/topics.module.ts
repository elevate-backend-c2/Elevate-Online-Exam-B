import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsManagementController } from './controllers/topics-management.controller';
import { TopicsController } from './controllers/topics.controller';
import { TopicsManagementService } from './services/topics-management.service';
import { TopicsService } from './services/topics.service';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { Diploma, DiplomaSchema } from '../diplomas/schemas/diploma.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Diploma.name, schema: DiplomaSchema },
    ]),
  ],
  controllers: [TopicsManagementController, TopicsController],
  providers: [TopicsService, TopicsManagementService],
  exports: [MongooseModule],
})
export class TopicsModule {}
