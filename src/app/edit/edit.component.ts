import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  post: Post;
  username: string;

  constructor(private BlogService: BlogService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.username = this.parseJWT(document.cookie).usr;
    activatedRoute.paramMap.subscribe(() => { 
      this.post = this.BlogService.getCurrentDraft();
      let urlpostid = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
      if (urlpostid == 0) {
        this.post = new Post(0, new Date(), new Date(), "", "");
        this.BlogService.setCurrentDraft(this.post);
      }
      else if(this.post == null || this.post.postid != urlpostid) {
        this.BlogService.getPost(this.username, urlpostid)
          .then(post => this.post = post)
          .catch(e => alert(e));
      }
    });
  }

  save() {
    this.post.modified = new Date();
    // if this is a new post, insert a new post
    if (this.post.postid == 0) {
      let newid = this.BlogService.getNewId();
      this.post.postid = newid;
      this.BlogService.newPost(this.username, this.post)
        .then(res => this.router.navigate(["/edit/"+newid]))
        .catch(e => alert(e));
    } else { // otherwise update the post
      this.BlogService.updatePost(this.username, this.post)
        .catch(e => alert(e));
    }
  }

  delete() {
    this.BlogService.deletePost(this.username, this.post.postid)
      .catch(e => alert(e));
    this.router.navigate(["/"]);
  }

  preview() {
    this.router.navigate(["/preview/" + this.post.postid]);
  }
  ngOnInit(): void {
  }

  parseJWT(token) 
  {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(atob(base64));
  }
}
