// import React, { useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import useFetch from '../hooks/use-fetch';
// import { getLongUrl, storeClicks } from '../DB/apiUrls';
// import { BarLoader } from 'react-spinners';

// const RedirectLink = () => {

//   const { id } = useParams();

//   const {loading, data, fn} = useFetch(getLongUrl, id);

//   const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
//     id: data?.id,
//     original_url: data?.original_url,
//   });

//   useEffect(() => {
//     fn();
//   }, []);

//   useEffect(() => {
//     if (!loading && data) {
//       fnStats();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading]);

//   if (loading || loadingStats) {
//     return (
//       <>
//         <BarLoader width={"100%"} color="#36d7b7" />
//         <br />
//         Redirecting...
//       </>
//     );
//   }

//   return null;
// };

// export default RedirectLink

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/use-fetch';
import { getLongUrl } from '../DB/apiUrls';
import { BarLoader } from 'react-spinners';
import { storeClicks } from '../DB/apiClicks';

const RedirectLink = () => {
  const { id } = useParams();

  const {
    loading: loadingUrl,
    data: urlData,
    fn: fetchUrl,
  } = useFetch(getLongUrl, id);

  const {
    fn: recordClick,
  } = useFetch(storeClicks, null); // don't call with data yet

  useEffect(() => {
    fetchUrl(); // fetch original_url by short ID
  }, []);

  useEffect(() => {
    const redirect = async () => {
      if (urlData?.original_url) {
        try {
          await recordClick({
            id: urlData.id,
            original_url: urlData.original_url,
          });
        } catch (e) {
          console.error("Failed to store click:", e);
        }

        // ✅ Now redirect to the original URL
        window.location.href = urlData.original_url;
      }
    };

    if (!loadingUrl && urlData) {
      redirect();
    }
  }, [loadingUrl, urlData]);

  return (
    <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting...
    </>
  );
};

export default RedirectLink;
