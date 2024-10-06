import { useSelector } from "react-redux";

const Message = ({ mess }) => {
  let { authUser } = useSelector((state) => state.auth);
  return (
    <div className={`${mess?.senderId == authUser?._id ? "flex justify-end" : "flex justify-start"}`}>
      {mess?.senderId == authUser?._id ? (
        <div className="w-fit  bg-blue-300 rounded-sm p-2 my-3 font-serif">
          <p>{mess?.text}</p>
        </div>
      ) : (
        <div className="w-fit bg-yellow-300 rounded-sm p-2 my-3 font-serif ">
          <p>{mess?.text}</p>
        </div>
      )}
    </div>
  );
};

export default Message;
