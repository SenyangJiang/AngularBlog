import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post, BlogService } from '../blog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  username: string;
  post: Post;
  constructor(private BlogService: BlogService, private activatedRoute: ActivatedRoute, private router: Router) { 
    this.username = this.parseJWT(document.cookie).usr;
    activatedRoute.paramMap.subscribe(() => { 
      this.post = this.BlogService.getCurrentDraft();
      let urlpostid = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
      if(this.post == null || this.post.postid != urlpostid) {
        this.BlogService.getPost(this.username, urlpostid)
          .then(post => this.post = post)
          .catch(e => alert(e));
      }
    });
  }

  render(md: string): string {
    let reader = new Parser();
    let writer = new HtmlRenderer();
    let parsed = reader.parse(md);
    let result = writer.render(parsed); // result is a String
    return result;
  }

  edit() {
    this.router.navigate(["/edit/" + this.post.postid]);
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
