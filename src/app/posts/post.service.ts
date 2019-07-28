import {Post} from './post.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>
              (
                'http://localhost:3000/posts'
              )
              .pipe(map((postData => {
                    return postData.posts.map(post => {
                        return{
                          title: post.title,
                          content: post.content,
                          id: post._id
                       };
                   });
              })))
              .subscribe(UpdatedData => {
                  this.posts = UpdatedData;
                  this.postUpdated.next([...this.posts]);
              });
  }

  getUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(Title: string, Content: string) {
   const post: Post = { id: null, title: Title, content: Content};
   this.http
            .post<{postId: string}>('http://localhost:3000/posts', post)
            .subscribe(respondData => {
                const postId = respondData.postId;
                post.id = postId;
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
   });
   }

   deletePost(postId: string) {
      this.http.delete('http://localhost:3000/posts/' + postId)
          .subscribe(() => {
           const UpdatedPost = this.posts.filter(post => post.id !== postId);
           this.posts = UpdatedPost;
           this.postUpdated.next([...this.posts]);
          });
   }
  }

