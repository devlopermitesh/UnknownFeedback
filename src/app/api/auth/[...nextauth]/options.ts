import CredentialsProvider from "next-auth/providers/credentials"
import {NextAuthOptions} from "next-auth"
import { dbConnect } from "@/app/lib/dbConnect"
import bcrypt  from "bcryptjs"
import UserModel from "@/app/Models/User"
export const Authoptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
              },

              async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    // ?? for some reseaon i try to only login with email ,but you can update 1
                //   const user=  await UserModel.findOne({$or:[
                //         {email:credentials.identifier},
                //         {username:credentials.identifier}
                //     ]})
                   const user =await UserModel.findOne({username:credentials.username})
console.log(credentials.username)

                    if(!user){

                        throw new Error("no user found with this email");
                    }
                    if(!user.verified){
                        throw new Error("please verify your accound first!")

                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error("Incorrrect password")
                    }

                } catch (err:any) {
                    throw new Error(err)
                    
                }


              }
        })
    ],
    callbacks:{
        

        async session({ session, token }) {
            if (token) {
                // console.log("Session Token:", token);  
        
                session.user._id = token._id as string | undefined;
                session.user.username = token.username as string | undefined;
                session.user.isAcceptMessage = token.isaccepting as boolean | undefined;
                session.user.verified = token.verified as boolean | undefined;
            } else {
                console.error("Token is undefined in session callback");
            }
        
            return session;
      },
      async jwt({ user,token}) {
        // console.log("hi i am jwt going to use user")
        // console.log(user)
        if (user) {
            token._id = user._id?.toString();
            token.verified = user.verified;
            token.username = user.username?.toString();
            token.isaccepting = user.isAcceptMessage;
        }
    
        return token
      }
  
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NextAUTH_SECRET
}
