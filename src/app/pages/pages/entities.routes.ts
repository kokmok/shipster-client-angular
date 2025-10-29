import { Routes } from '@angular/router';
import { ArticleComponent } from '@/pages/article/article.component';
import { TagComponent } from '@/pages/tag/tag.component';
import { Swagger } from '@/pages/swagger/swagger';

export let entitiesRoutes = [
  { path: 'articles', component: ArticleComponent },
    { path: 'tags', component: TagComponent },
    { path: 'doc', component: Swagger },
  ] as Routes;
