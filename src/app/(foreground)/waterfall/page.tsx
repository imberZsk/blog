import { data } from './constant'
import Image from 'next/image'
import Img1 from '../../../../public/1.jpg'
export default function WaterFall() {
  return (
    <div>
      <Image src={Img1} alt=""></Image>
      {data.map((item, index) => {
        return (
          <div key={index}>
            <Image src={item.note_card.cover.url_default} width={200} height={200} alt=""></Image>
          </div>
        )
      })}
    </div>
  )
}
