"""Community engagement endpoints."""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class CreatePostRequest(BaseModel):
    """Create post request."""
    title: str
    content: str
    post_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tags: List[str] = []


class CommentRequest(BaseModel):
    """Comment request."""
    content: str


@router.get("/posts")
async def get_feed():
    """Get community feed."""
    return {
        "posts": [],
        "count": 0
    }


@router.post("/posts")
async def create_post(request: CreatePostRequest):
    """Create a community post."""
    return {
        "post_id": "temp-post-id",
        "message": "Post created successfully"
    }


@router.post("/posts/{post_id}/like")
async def like_post(post_id: str):
    """Like a post."""
    return {"message": "Post liked"}


@router.post("/posts/{post_id}/comment")
async def comment_on_post(post_id: str, request: CommentRequest):
    """Comment on a post."""
    return {
        "comment_id": "temp-comment-id",
        "message": "Comment posted"
    }
