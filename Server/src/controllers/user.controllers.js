import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // algorithm  for register a new user
  // get the all details from the frontend
  // validate all
  //  check the user is already registered or not
  // if it then return to login
  // otherwise
  // create a object in the database to store the data in the database
  // then display the information about the  new user

  // destructuring of data to get the data from the frontend
  const { userName, avatar, password, bio, name } = req.body;
  
  // validation the input data 

  if(!userName || !avatar || !password 
    || !bio || !name){
      
    }
  
});

export { registerUser };
