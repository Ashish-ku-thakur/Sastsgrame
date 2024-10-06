import { Heart, MessageCircle } from "lucide-react";

const FramePost = ({post}) => {
  
  return (
    <div className="w-full my-4">
      <div className="h-[200px] relative group">
        <img className="w-full h-full" src={post?.postImage} alt="" />
        {/* abso icons and num */}
        <div className="absolute top-0 left-0 h-full z-10 w-full bg-opacity-60 hover:bg-zinc-900 hover:bg-opacity-60 hover:text-white flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-5">
            <button className="flex gap-2 items-center">
              <div className="font-bold">{post?.likes?.length}</div>
              <Heart />
            </button>
            <button className="flex gap-2 items-center">
              <div className="font-bold">{post?.comments?.length}</div>
              <MessageCircle />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FramePost;
