import { Injectable } from '@angular/core';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;

  constructor (postid: number, created: Date, modified: Date, title: string, body: string) {
    this.postid = postid;
    this.created = created;
    this.modified = modified;
    this.title = title;
    this.body = body;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private current_post: Post;
  private newid;

  constructor() {
    this.current_post = null;
  }

  callback = null;

  subscribe(callback){
    this.callback = callback;
  }

  setNewId(newid : number): void {
    this.newid = newid;
  }

  getNewId(): number {
    return this.newid;
  }

  async fetchPosts(username: string): Promise<Post[]> {
    let arr: Post[] = [];
    // let result = new Promise<Post[]>(function(resolve, reject){
    //   resolve(arr);
    // });
    try {
      let res = await fetch("/api/"+username)
      if (!res.ok) {
        console.log("not ok");
        throw new Error(res.status.toString());
      }
      let docs = await res.json();
      docs.forEach(function(item){
        arr.push(new Post(item.postid, new Date(item.created), new Date(item.modified), item.title, item.body));
      });
      return new Promise<Post[]>(function(resolve, reject){
        resolve(arr);
      });
    } catch(e) {
      return new Promise<Post[]>(function(resolve, reject){
        reject(e);
      });
    }
  }

  async getPost(username: string, postid: number): Promise<Post> {
    let curr_post = new Post(-1, new Date(), new Date(), "nope", "nope");
    try{
      let res = await fetch("/api/"+username+"/"+postid);
      if (!res.ok) {
        console.log("NOT OK!");
        throw new Error(res.status.toString());
      }
      let item = await res.json()
      curr_post.postid = item.postid;
      curr_post.created = new Date(item.created);
      curr_post.modified = new Date(item.modified);
      curr_post.title = item.title;
      curr_post.body = item.body;
      return new Promise<Post>(function(resolve, reject){
        resolve(curr_post);
      });
    } catch(e) {
      return new Promise<Post>(function(resolve, reject){
        reject(e);
      });
    }
  }

  async newPost(username: string, post: Post): Promise<void> {
    try{
      let res = await fetch("/api/"+username+"/"+post.postid, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: post.title, body: post.body})
      });
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      if(this.callback) this.callback();
      return new Promise<void>(function(resolve, reject){
        resolve();
      });
    } catch(e) {
      return new Promise<void>(function(resolve, reject){
        reject(e);
      });
    }
  }

  async updatePost(username: string, post: Post): Promise<void> {
    try{
      console.log(post.title);
      console.log(post.body);
      let res = await fetch("/api/"+username+"/"+post.postid, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: post.title, body: post.body})
      });
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      if(this.callback) this.callback();
      return new Promise<void>(function(resolve, reject){
        resolve();
      });
    } catch(e) {
      return new Promise<void>(function(resolve, reject){
        reject(e);
      });
    }
  }

  async deletePost(username: string, postid: number): Promise<void> {
    try{
      let res = await fetch("/api/"+username+"/"+postid, {method: 'delete'});
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      if(this.callback) this.callback();
      return new Promise<void>(function(resolve, reject){
        resolve();
      });
    } catch(e) {
      return new Promise<void>(function(resolve, reject){
        reject(e);
      });
    }
  }

  setCurrentDraft(post: Post): void {
    this.current_post = post;
  }

  getCurrentDraft(): Post {
    return this.current_post;
  }
}
