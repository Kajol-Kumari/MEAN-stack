import { Component, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../posts/post.model';
import {PostsService} from '../posts/post.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub = new Subscription();

constructor(public postsService: PostsService) {}

ngOnInit() {
  this.postsService.getPosts();
  this.postsSub = this.postsService.getUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
}

onDelete(postId: string) {
  this.postsService.deletePost(postId);
}

ngOnDestroy() {
  this.postsSub.unsubscribe();
}

}
