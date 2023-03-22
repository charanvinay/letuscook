import { Avatar, Divider, ListItemAvatar } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "../../Common/Skeletons/ListItem";
import { db } from "../../services/firebase";

export default function OtherRecipes({ uid, name }) {
  const [loadding, setLoadding] = useState(true);
  const [recipesList, setRecipesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (uid) {
      getUserRecipes();
    }
  }, [uid]);

  const getUserRecipes = async () => {
    setRecipesList([]);
    setLoadding(true);
    try {
      let user_ref = query(collection(db, "recipes"), where("uid", "==", uid));
      let user_docs = await getDocs(user_ref);
      if (user_docs.docs.length > 0) {
        let recipes = [];
        user_docs.docs.map((doc) => {
          recipes.push({ _id: doc.id, ...doc.data() });
        });
        console.log(recipes);
        setRecipesList([...recipes]);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadding(false);
  };

  return (
    <List
      sx={{ width: "100%" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{
            textTransform: "capitalize",
          }}
        >
          Other recipes of {name}
        </ListSubheader>
      }
    >
      {loadding ? (
        [1, 2].map((loader) => <ListItem key={loader} />)
      ) : (
        <>
          {recipesList.map((recipe, ind) => {
            return (
              <div key={ind}>
                <ListItemButton
                  onClick={() => navigate(`/view?id=${recipe._id}`)}
                >
                  <ListItemAvatar>
                    <Avatar src={recipe.finish.imgSrc} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={recipe.title}
                    secondary={`${recipe.type} | Serves - ${recipe.serves}`}
                  />
                </ListItemButton>
                {recipesList.length - 1 != ind && <Divider />}
              </div>
            );
          })}
        </>
      )}
    </List>
  );
}