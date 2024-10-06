const Message = ({ mess }) => {
  return (
    <div className="w-fit bg-blue-300 rounded-sm p-2 my-3 font-serif">
      <p>{mess?.text}</p>
    </div>
  );
};

export default Message;
