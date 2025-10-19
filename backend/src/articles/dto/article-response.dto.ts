import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  authorEmail: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
