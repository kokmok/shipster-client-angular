import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ArticleService } from '@/services/article-service';
import { TagService } from '@/services/tag-service';
import { Tag, ITag } from '@/models/tag.model';
import { Article, IArticle } from '@/models/article.model';
import { Checkbox } from 'primeng/checkbox';
import { Drawer } from 'primeng/drawer';
import { MultiSelect } from 'primeng/multiselect';



interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        InputText,
        Drawer,
        Checkbox,
        MultiSelect
    ],
    templateUrl: "article.component.html",
    providers: [MessageService, ArticleService, ConfirmationService]
})
export class ArticleComponent implements OnInit {
    createDialog: boolean = false;

    articles = signal<IArticle[]>([]);

    tags= signal<ITag[]>([])

    article!: IArticle;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private articleService: ArticleService,
        private tagService: TagService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.articleService.findAll()
            .subscribe(res => this.articles.set(res.body ?? []));
        this.tagService.findAll()
            .subscribe(res => this.tags.set(res.body ?? []));

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Name' },
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.article = new Article();
        this.submitted = false;
        this.createDialog = true;
    }

    editArticle(article: Article) {
        this.article = { ...article };
        if (this.article.tag && this.article.tag) {
            this.article.tag = this.tags().find(e => e.id = this.article.tag?.id)
        }

        this.createDialog = true;
    }


    hideDialog() {
        this.createDialog = false;
        this.submitted = false;
    }

    deleteArticle(article: Article) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete Article ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.articles.set(this.articles().filter((val) => val.id !== article.id));
                this.article = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Article Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.articles().length; i++) {
            if (this.articles()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    saveArticle() {
        this.submitted = true;

            if (this.article.id) {
                this.articleService.update(this.article)
                    .subscribe(res => {
                        if (res.body) {
                            this.articles.set(
                                this.articles().map((article) => res.body && res.body.id === article.id ? res.body : article)
                            );
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Language Updated',
                                life: 3000
                                });
                            }
                        });

            } else {
                this.articleService.create(this.article)
                    .subscribe(res => {
                        if (res.body?.id) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Product Created',
                                life: 3000
                            });

                            this.articles().push(res.body);
                        }

                    })

            }

            this.createDialog = false;
            this.article = {};


    }
}
