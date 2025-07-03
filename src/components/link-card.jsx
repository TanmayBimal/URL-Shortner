import { Copy, Delete, Download, LinkIcon, Trash } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { deleteUrl } from '../DB/apiUrls'
import useFetch from '../hooks/use-fetch'
import { BeatLoader } from 'react-spinners'

const LinkCard = ({url,fetchUrls}) => {

    const downloadImage = () => {
        const imageUrl = url?.qr;
        const fileName = url?.title; // Desired file name for the downloaded image

    
        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;   
        
        document.body.appendChild(anchor);

        anchor.click();

        document.body.removeChild(anchor);
    };

    const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url?.id);

  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
      <img src={url?.qr}
      className='h-32 object-contain ring ring-blue-500 self-start' alt="qr code" />

    <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
    <span  className="text-3xl text-white font-extrabold hover:underline cursor-pointer">{url?.title}</span>
    <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          https://trimrr.in/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 text-blue-400 font-bold hover:underline cursor-pointer">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>    
        <span className="flex items-end font-extralight  text-white flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
    </Link>

    <div className='flex gap-2'>
        <Button variant="ghost" className="border-white text-white hover:bg-white/10" onClick={() =>
            navigator.clipboard.writeText(`https://trimrr.in/${url?.short_url}`)
          }><Copy /></Button>
        <Button variant="ghost" className="border-white text-white hover:bg-white/10" onClick={downloadImage}><Download /></Button>
        <Button variant="ghost" className="border-white text-white hover:bg-white/10" onClick={() => fnDelete().then(() => fetchUrls())}> {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}</Button>
    </div>

    </div>
  )
}

export default LinkCard
