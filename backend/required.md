> # user auth flow -
>
> - `/auth/sign-up` - will create a user with the details in it and then add the jwt to cookies
>   ```
>   {
>       name: "",
>       age: 15,
>       password: "password2",
>       email: "",
>       address: {
>          city: "",
>          zip: "",
>          country: "",
>          state: "",
>          location: {
>              lat: "",
>              long: "",
>          }
>       },
>       hobbies: ["",""],
>       image: "",
>   }
>   ```
> - `/auth/login` - will create a user with the details in it and then add the jwt to cookies
>   ```
>   {
>       email: "",
>       password: "",
>   }
>   ```
> - `/auth` - will send jwt in cookies send me the user
> - `/auth/update` - will update normal things
>   ```
>   {
>       name: "",
>       age: 15,
>       password: "password2",
>       email: "",
>       address: {
>          city: "",
>          zip: "",
>          country: "",
>          state: "",
>          location: {
>              lat: "",
>              long: "",
>          }
>       },
>       hobbies: ["",""],
>       image: "",
>   }
>   ```
> - `/auth/password-update` - will update password
>   ```
>   {
>       password: "",
>   }
>   ```

> # middleware -
>
> - have a middleware to verify jwt

> # friend request flow -
>
> - `/create-friend-request` - will send
>   ```
>   {
>       id: "of the user sending request",
>       friendId: "requesting friend id",
>   }
>   ```
> - `/friend-requests` - will send me the friend requests
> - `/accept-friend-request` - will set status to accept and set a cron job to delete that request in 2-3 hr
> - `/reject-friend-request` - do same as before

> # Search & suggestion
>
> - `/search/string` - return me the users with basic info
> - `/suggest` - return me the users with basic info of suggestion
