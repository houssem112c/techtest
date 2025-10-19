import {
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { ArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<ArticleResponseDto> {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      authorId: userId,
    });
    const savedArticle = await this.articlesRepository.save(article);
    return this.toResponseDto(savedArticle);
  }

  async findAll(userRole: UserRole): Promise<ArticleResponseDto[]> {
    let articles: Article[];

    if (userRole === UserRole.ADMIN) {
      articles = await this.articlesRepository.find({
        order: { createdAt: 'DESC' },
      });
    } else {
      articles = await this.articlesRepository.find({
        where: { isPublished: true },
        order: { createdAt: 'DESC' },
      });
    }

    return articles.map((article) => this.toResponseDto(article));
  }

  async findOne(id: string): Promise<ArticleResponseDto> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return this.toResponseDto(article);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    Object.assign(article, updateArticleDto);
    const updatedArticle = await this.articlesRepository.save(article);
    return this.toResponseDto(updatedArticle);
  }

  async remove(id: string): Promise<void> {
    const result = await this.articlesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  private toResponseDto(article: Article): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      isPublished: article.isPublished,
      authorId: article.authorId,
      authorEmail: article.author?.email || 'Unknown',
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
