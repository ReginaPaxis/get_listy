//functions as a props bridge between Form.js and MetaList.js by:
// containing state init and passing it to Form as a prop to be updated by form submit
// + holds firebase side effect(useEffect) and uses onValue to listen for changes to db.on state change: (re)render MetaList which triggers(re)renders of Lists and ListItems

//1. import React Hooks
import { useEffect, useState } from 'react';
//useState

//import child components
import Form from './Form';
import MetaList from './MetaList';

//2. import firebase config info
import firebase from '../firebase';
// 2a. import necessary modules to complete steps in 4. 
import { onValue, ref, getDatabase } from 'firebase/database';
//, remove, push


function GetListy() {
  //3. initiailize piece of state that will hold the data received from firebase db. - will be passed to Form as props for it to update when user submits new list (& list name)
  const [lists, setLists] = useState([]);

  // 9B. initialize a piece of state to keep track of the internal state of the text inputs
    // pass down as props to form
      // pass the updater to form to capture the usder inputs
      // pass the state variable to firebase pushing function ... should this be a component? 
  const [itemTextInput, setItemTextInput] = useState("");
  const [listTextInput, setListTextInput] = useState("");

  
  //4. side effect to run on component mount
  //4a. set up firebase db ref and all the boiler plate stuff = store db and create reference to it
  useEffect(()=>{
    const db = getDatabase(firebase);
    const dbRef = ref(db);

    // console.log(firebase);

    // 5. use onValue to listen for changes to the db and save the lists and their items that are currently in the db within state (=call the state updater funciton = setLists)
    onValue(dbRef, (dbResponse)=>{
      const dbValue = dbResponse.val();
      console.log(dbValue);

      const arrayOfLists = [];

      for (let propertyKey in dbValue){
        console.log(dbValue[propertyKey]);

        arrayOfLists.push({
          listName: {
            listItems: dbValue[propertyKey],
            id: propertyKey
          }
        });
      }

      setLists(arrayOfLists);
    });

  }, []);


  console.log(lists);
  return(
    <>
      <Form itemProps={[itemTextInput, setItemTextInput]} listProp={[listTextInput, setListTextInput]}/>

      {/* 7. pass the lists piece of state as props to MetaList to generate the nec child components for the different pieces of data */}
      <MetaList listOfLists={setLists}/>
    </>
  );
}

export default GetListy;