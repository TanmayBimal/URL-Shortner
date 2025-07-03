import React, { useEffect } from 'react'
import { UrlState } from '../context';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUrl, getUrl } from '../DB/apiUrls';
import { getClicksForUrl } from '../DB/apiClicks';
import useFetch from '../hooks/use-fetch';
import { BarLoader, BeatLoader } from 'react-spinners';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Location from '../components/location-stats';
import Device from '../components/device-stats';

const Link = () => {

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

  const {user} = UrlState();
  const {id} = useParams();
  const navigate = useNavigate();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
       {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className='flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
<span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
<a href={`https://trimrr.in/${link}`} target='_blank'  className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer'> https://trimrr.in/{link}
</a>
<a href={url?.original_url} target='_blank' className='flex items-center gap-1 hover:underline cursor-pointer'>
<LinkIcon className="p-1" />
  {url?.original_url}</a>

  <span className='flex items-end font-extralight text-sm'>{new Date(url?.created_at).toLocaleString()}</span>
  <div className='flex gap-2'>
        <Button variant="ghost" className="border-blue-500 text-blue-500 hover:bg-white/10" onClick={() =>
            navigator.clipboard.writeText(`https://trimrr.in/${url?.short_url}`)
          }><Copy /></Button>
        <Button variant="ghost" className="border-blue-500 text-blue-500 hover:bg-white/10" onClick={downloadImage}><Download /></Button>
        <Button variant="ghost" className="border-blue-500 text-blue-500 hover:bg-white/10" onClick={() => fnDelete()}> {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}</Button>
    </div>

    <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div> 

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <Device stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link
