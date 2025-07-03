import React, { useEffect, useRef, useState } from 'react'
import { UrlState } from '../context'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
// import { Input } from 'postcss';
import { Input } from "@/components/ui/input";
import Error from './error';
import { Card } from './ui/card';
import * as yup from 'yup'
import { QRCode } from 'react-qrcode-logo';
import useFetch from '../hooks/use-fetch';
import { createUrl } from '../DB/apiUrls';
import { BeatLoader } from 'react-spinners';



const CreateLink = () => {

const {user} = UrlState();
const navigate = useNavigate();

const ref = useRef();

let [searchParams, setSearchParams] =  useSearchParams();
const longLink = searchParams.get("createNew");

const [errors,setErrors] = useState({});
const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
});

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl,{...formValues,user_id:user.id});

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);


  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, {abortEarly: false});

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };
                                         


  return (
    
      <Dialog defaultOpen={longLink}
      onOpenChange={(isOpen)=> {
        if(!isOpen) setSearchParams({});
      }}>
  <DialogTrigger>
    <Button variant="destructive" className="bg-red-600 text-white hover:bg-red-700">Create New Link</Button>
  </DialogTrigger>
  <DialogContent  className="bg-white text-black z-[9999] shadow-xl rounded-lg sm:max-w-md">
    <DialogHeader>
      <DialogTitle  className="text-lg font-bold text-2xl">Create New</DialogTitle>
    </DialogHeader>

      {formValues?.longUrl && <QRCode value={formValues?.longUrl} size={250} ref={ref}/>}

    <Input id="title" placeholder="Short Link's Title"
    value={formValues.title}
    onChange={handleChange}/>

    {errors.title && <Error message={errors.title} />}


    <Input id="longUrl" 
    placeholder="Enter your Looong URL"
    value={formValues.longUrl}
    onChange={handleChange}/>
    {errors.longUrl && <Error message={errors.longUrl} />}

    <div className='flex items-center gap-2'>
        <Card className="p-2">trimrr.in</Card> /
        <Input id="customUrl" placeholder="Custom Link (optional)"
        value={formValues.customUrl}
        onChange={handleChange}/>
    </div>
    {error && <Error message={errors.message} />}
    <DialogFooter className="sm:justify-start">
      <Button disabled={loading} variant="destructive" className="bg-red-600 text-white hover:bg-red-700" onClick={createNewLink} >{loading ? <BeatLoader size={10} color="white" /> : "Create"}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    
  )
}

export default CreateLink
