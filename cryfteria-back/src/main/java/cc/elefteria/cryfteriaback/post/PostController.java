package cc.elefteria.cryfteriaback.post;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping()
    public ResponseEntity<PostDto> createPost(@ModelAttribute PostDto postDto){
        String hashKey = postService.createPost(postDto);
        
        PostDto postDtoRes = PostDto.builder().hashKey(hashKey).build();
        
        return ResponseEntity.ok(postDtoRes);
    }
    
    @GetMapping("/{hashKey}")
    public ResponseEntity<PostDto> getPostByHashKey(@PathVariable String hashKey) {
        return ResponseEntity.ok(postService.getPostByHashKey(hashKey));
    }
}
