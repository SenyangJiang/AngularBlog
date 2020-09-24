import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  posts: Post[];
	username: string;

  constructor(private BlogService: BlogService, private router: Router) {
    if (!document.cookie) {
      alert("user not logged in");
      this.username = "asdfghjkl";
    } else {
      this.username = this.parseJWT(document.cookie).usr;
    }

    // when the component loads, obtain all the blog posts
    this.refreshPosts();
    
    this.BlogService.subscribe(() => {
      this.BlogService.fetchPosts(this.username)
      .then(posts => {
        console.log(posts);
        this.posts = posts.sort(function(a, b) {
				  return a.postid - b.postid;
        });
        // determine id for new post
        let newid = this.posts[this.posts.length - 1].postid + 1;
        this.BlogService.setNewId(newid);
      })
      .catch(e => alert(e));
    });
	}
  
  refreshPosts() {
    this.BlogService.fetchPosts(this.username)
      .then(posts => {
        console.log(posts);
        this.posts = posts.sort(function(a, b) {
				  return a.postid - b.postid;
        });
        // determine id for new post
        let newid = this.posts[this.posts.length - 1].postid + 1;
        this.BlogService.setNewId(newid);
    })
      .catch(e => alert(e));
  }
	parseJWT(token) 
  {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(atob(base64));
  }

  edit(postid: number) {
    this.BlogService.getPost(this.username, postid)
      .then(post => {
        this.BlogService.setCurrentDraft(post);
        this.router.navigate(["/edit/"+postid]);
      })
     .catch (e => alert(e));
  }

	create() {
    this.router.navigate(["/edit/0"]);
	}

  ngOnInit(): void {
  }
  
  
}
