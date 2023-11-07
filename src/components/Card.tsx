import { Result } from '../interface';

interface ICard {
  res: Result;
}

export const Card = ({ res }: ICard) => {
  return (
    <div className="card">
      <img
        src={`https://farm${res.farm}.staticflickr.com/${res.server}/${res.id}_${res.secret}.jpg`}
      />
    </div>
  );
};
