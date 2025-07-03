import supabase, { supabaseUrl } from "./supabase";

export async function login({email, password}) {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,  
    });

    if(error) throw new Error(error.message);

    return data;
}

export async function getCurrentUser(){
    const{data: session, error} = await supabase.auth.getSession();
    if (!session.session) return null;
        if (error) throw new Error(error.message);
        return session.session?.user;
}

export async function signup({name, email, password, profile_pic}) {

    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    const {error: storageError} = await supabase.storage.from("profile-pic").upload(fileName, profile_pic);

    if (storageError) throw new Error(storageError.message);

    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            data: {
                name,
                profile_pic:`${supabaseUrl}/storage/v1/object/public/profile-pic/${fileName}`,
            },
        },
    });
    if (error) throw new Error(error.message);

    return data;
}


export async function logout() {
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }



// import supabase, { supabaseUrl } from "./supabase"; // Make sure supabaseUrl is also imported

// export async function login({ email, password }) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) throw new Error(error.message);
//   return data;
// }

// export async function getCurrentUser() {
//   const { data: session, error } = await supabase.auth.getSession();
//   if (error) throw new Error(error.message);
//   if (!session.session) return null;
//   return session.session?.user;
// }

// export async function signup({ name, email, password, profile_pic }) {
//   // ✅ FIXED: Correct file name for upload
//   const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}`;

//   // ✅ FIXED: filename was incorrectly used as "filename", should be fileName
//   const { error: storageError } = await supabase.storage
//     .from("profile_pic")
//     .upload(fileName, profile_pic);

//   if (storageError) throw new Error(storageError.message);

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         name,
//         profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
//       },
//     },
//   });

//   if (error) throw new Error(error.message);
//   return data;
// }
