import { useSelector } from 'react-redux';

const Ch = () => {
  let { authUser } = useSelector((store) => store?.auth);

  return (
    <div>
        {
            authUser
        }
    </div>
  )
}

export default Ch