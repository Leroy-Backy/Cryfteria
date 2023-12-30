// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Ownable.sol";
import "./ERC721.sol";

contract Cryfteria is Owner, ERC721 {

    event NewPost(uint postId, address owner);

    struct Post {
        uint256 hashKey;
        uint donated;
    }
    
    struct PostDto {
        uint256 hashKey;
        uint donated;
        uint id;
        address owner;
        uint price;
    }

    Post[] public posts;

    uint minDonate = 0.001 ether;

    mapping (uint => address) public postToOwner;
    mapping (uint => uint) public postToPrice;

    function setPostForSell(uint _tokenId, uint price) external {
        require(postToOwner[_tokenId] == msg.sender && price > 0);

        postToPrice[_tokenId] = price;
    }

    function buyPost(uint _tokenId) external payable {
        require(postToPrice[_tokenId] > 0 && msg.value == postToPrice[_tokenId]);

        address payable postOwner = payable(postToOwner[_tokenId]);
        delete postToPrice[_tokenId];
        _transfer(postOwner, msg.sender, _tokenId);
        postOwner.transfer(msg.value * 900 / 1000);
    }

    function getTopDonatedPosts(uint n) external view returns (PostDto[] memory) {
        uint k;

        if (posts.length <= n) {
            k = posts.length;
        } else {
            k = n;
        }

        PostDto[] memory result = new PostDto[](k);

        for (uint256 i = 0; i < k; i++) {
            result[i] = PostDto(posts[i].hashKey, posts[i].donated, i, postToOwner[i], postToPrice[i]);
        }

        for (uint256 i = k; i < posts.length; i++) {
            uint256 minValueIndex = 0;
            for (uint256 j = 1; j < k; j++) {
                if (result[j].donated < result[minValueIndex].donated) {
                    minValueIndex = j;
                }
            }

            if (posts[i].donated > result[minValueIndex].donated) {
                result[minValueIndex] = PostDto(posts[i].hashKey, posts[i].donated, i, postToOwner[i], postToPrice[i]);
            }
        }

        return result;
    }

    function donate(uint _postId) external payable {
        require(msg.value >= minDonate);
        address payable postOwner = payable(postToOwner[_postId]);

        postOwner.transfer(msg.value * 700 / 1000);
        posts[_postId].donated += msg.value;
    }

    function changeMinDonate(uint _minDonate) external isOwner {
        minDonate = _minDonate;
    }

    function contractBalance() external view returns (uint) {
        return address(this).balance;
    }


    // erc721 implementatiom.
    mapping (uint => address) postApprovals;

    function balanceOf(address _owner) external view override returns (uint256) {
        return getPostCountByOwner(_owner);
    }

    function ownerOf(uint256 _tokenId) external view override returns (address) {
        return postToOwner[_tokenId];
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable override {
        require (postToOwner[_tokenId] == msg.sender || postApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable override {
        require(msg.sender == postApprovals[_tokenId]);
        postApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        postToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }
    // end of implementation


    function withdraw() external isOwner {
        address payable _owner = payable(getOwner());
        _owner.transfer(address(this).balance);
    }

    function createPost(uint256 _hashKey) public {
        posts.push(Post(_hashKey, 0));
        uint id = posts.length - 1;
        postToOwner[id] = msg.sender;
        emit NewPost(id, msg.sender);
    }

    function getPostsByOwner(address _owner) external view returns(PostDto[] memory) {
        PostDto[] memory result = new PostDto[](getPostCountByOwner(_owner));

        uint counter = 0;

        for(uint i = 0; i < posts.length; i++) {
            if(postToOwner[i] == _owner) {
                Post memory post = posts[i];
                result[counter] = PostDto(post.hashKey, post.donated, i, postToOwner[i], postToPrice[i]);
                counter++;
            }
        }

        return result;
    }

    function getPostById(uint id) external view returns(PostDto memory) {
        Post memory post = posts[id];
        return PostDto(post.hashKey, post.donated, id, postToOwner[id], postToPrice[id]);
    } 

    function getPostCountByOwner(address _owner) public view returns (uint) {
        uint count = 0;

        for(uint i = 0; i < posts.length; i++) {
            if(postToOwner[i] == _owner) {
                count++;
            }
        }

        return count;
    }

    fallback() external payable{
    }
    receive() external payable {
    }
}
