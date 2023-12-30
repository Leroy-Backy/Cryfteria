package cc.elefteria.cryfteriaback.post;

import cc.elefteria.cryfteriaback.exception.CryfteriaEntityNotFoundException;
import cc.elefteria.cryfteriaback.images.Image;
import cc.elefteria.cryfteriaback.images.ImageService;
import cc.elefteria.cryfteriaback.user.User;
import com.google.common.hash.Hashing;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PostService {
    
    private final ImageService imageService;
    private final PostRepository postRepository;
    
    @Transactional
    public String createPost(PostDto postDto) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        
        Post post = Post.builder()
                .title(postDto.getTitle())
                .description(postDto.getDescription())
                .owner(user)
                .build();

        MultipartFile[] files = postDto.getFiles();

        if(files != null){
            for(MultipartFile file: files){
                String fileName = imageService.uploadImageToLocalFileSystem(file);

                Image image = new Image(fileName);
                post.addImage(image);
            }
        }
        
        String hashKey = Hashing.sha256()
            .hashString(UUID.randomUUID().toString(), StandardCharsets.UTF_8)
            .toString()
            .replaceFirst("^0*", "");

        
        
        // todo check if key is taken
        
        post.setHashKey(hashKey);

        postRepository.save(post);
        
        return hashKey;
    }

    public PostDto getPostByHashKey(String hashKey) {
        return PostDto.fromPost(
            postRepository.findByHashKey(hashKey).orElseThrow(() -> 
                new CryfteriaEntityNotFoundException("Post not found with given hashkey")
            )
        );
    }
}
