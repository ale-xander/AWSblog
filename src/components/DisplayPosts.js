import React, { Component } from 'react';
import { listPosts } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { onCreatePost, onDeletePost } from "../graphql/subscriptions";
import DeletePost from './DeletePost';
import EditPost from "./EditPost";

class DisplayPosts extends Component {
    state = {
        posts: []
    }

    componentDidMount = async() => {
        this.getPosts()

        this.createPostListener = API.graphql(graphqlOperation(onCreatePost)).subscribe({
            next: postData => {
                const newPost = postData.value.data.onCreatePost;
                const previousPosts = this.state.posts.filter(
                    post => post.id !== newPost.id
                );
                const updatedPosts = [newPost, ...previousPosts]
                this.setState({ posts: updatedPosts})
            }
        });
        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost)).subscribe({
            next: postData => {
                const deletedPost = postData.value.data.onDeletePost;
                const updatedPosts = this.state.posts.filter(
                    post => post.id !== deletedPost.id
                );
                this.setState({ posts: updatedPosts})
            }
        });
    }

    componentWillUnmount(){
        this.createPostListener.unsubscribe();
        this.deletePostListener.unsubscribe();
    }

    getPosts = async() => {
        const result = await API.graphql(graphqlOperation(listPosts))
        // console.log('all posts: ', JSON.stringify(result.data.listPosts.items))
        this.setState({posts: result.data.listPosts.items })
    }

    render() {

        const {posts} = this.state;    

        return posts.map((post) => {
            return(
                <div className="posts" style={rowStyle} key={ post.id }>
                    <h1>
                        {post.postTitle}
                    </h1>
                    <span style={{fontStyle: 'italic', color: 'blue'}}>
                        {"wrote by:"} {post.postOwnerUsername}
                        {" on "}
                        <time style={{fontStyle: 'italic'}}>
                            {" "}
                            {new Date(post.createdAt).toDateString()}
                        </time>
                        <p>
                        {post.postBody}
                        </p>
                        <br/>
                        <span>
                            <DeletePost data={post}/>
                            <EditPost />
                        </span>
                    </span>
                </div>
            )
        })
    }
}
const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}
export default DisplayPosts;