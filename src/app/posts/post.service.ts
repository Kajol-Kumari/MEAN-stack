import {Post} from './post.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postperpage: number , currentpage: number) {
    const queryParams = `?pagesize=${postperpage}&page=${currentpage}`;
    this.http
        .get<{message: string, posts: any, maxPosts: number}>
              (
                'http://localhost:3000/posts' + queryParams
              )
              .pipe(map(postData => {
                    return { posts: postData.posts.map(post => {
                        return{
                          title: post.title,
                          content: post.content,
                          id: post._id,
                          imagePath: post.imagePath
                       };
                   }), maxPosts: postData.maxPosts};
              }))
              .subscribe(UpdatedData => {
                  this.posts = UpdatedData.posts;
                  this.postUpdated.next({
                    posts: [...this.posts],
                    postCount: UpdatedData.maxPosts});
              });
  }

  getpost(id: string) {
    return  this.http.get<{_id: string, title: string, content: string, imagePath: string}>
           ('http://localhost:3000/posts/' + id) ;
  }

  getUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(Title: string, Content: string, image: File) {
   const postData = new FormData();
   postData.append('title', Title);
   postData.append('content', Content);
   postData.append('image', image, Title);
   this.http
            .post<{post: Post}>('http://localhost:3000/posts',
                                    postData)
            .subscribe(respondData => {
                this.router.navigate(['/']);
   });
   }

   updatePost(iid: string, Title: string, Content: string, image: File | string ) {
      let postData: Post | FormData;
      if (typeof(image === 'object')) {
      postData = new FormData();
      postData.append('id', iid);
      postData.append('title', Title);
      postData.append('content', Content);
      postData.append('image', image, Title);

    } else {
      postData = {
        id: iid,
        title: Title,
        content: Content,
        imagePath: image
      };
    }
      this.http
    .put('http://localhost:3000/posts/' + iid, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
   }

   deletePost(postId: string) {
      return this.http.delete('http://localhost:3000/posts/' + postId);
   }
  }

