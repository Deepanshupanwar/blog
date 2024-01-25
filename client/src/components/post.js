import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id,title, summary, cover, content,createdAt,author}){
    return (
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
              <img src={cover} alt=""/>
            </Link>
          </div>
          <div className="texts">
            <Link to={`/post/${_id}`}>
              <h2>{title}</h2>
            </Link>
            <p className="info">
              <Link to={`/profile/${author._id}`} className="author">{author.username}</Link>
              <time>{format(new Date(createdAt), 'MMM d yyyy, HH:mm')}</time>
            </p>
            <p className="summary">{summary}</p>
          </div>
      </div>
    );
}