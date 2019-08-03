import { Component, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../posts/post.model';
import {PostsService} from '../posts/post.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub = new Subscription();
  currentPage = 1;
  totalPages = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 4, 5];


constructor(public postsService: PostsService) {}

ngOnInit() {
  this.isLoading = true;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
  this.postsSub = this.postsService.getUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPages = postData.postCount;
      });
}

onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.postsPerPage = pageData.pageSize;
  this.currentPage = pageData.pageIndex + 1;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
}

onDelete(postId: string) {
  this.postsService.deletePost(postId).subscribe( () => {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  });
}

ngOnDestroy() {
  this.postsSub.unsubscribe();
}

}
