import { Avatar, Divider, ListItemAvatar, Paper } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "../../Common/Skeletons/ListItem";
import { db } from "../../services/firebase";

export default function OtherRecipes({ id, uid, name }) {
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
          if (doc.id !== id) {
            recipes.push({ _id: doc.id, ...doc.data() });
          }
        });
        // console.log(recipes);
        setRecipesList([...recipes]);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadding(false);
  };

  return (
    <>
      {recipesList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ y: [20, 0], opacity: [0, 1] }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Paper
            sx={{
              borderRadius: "8px",
              padding: "24px",
              overflow: "hidden",
              boxShadow: "0px 1px 8px rgb(23 110 222 / 10%)",
            }}
          >
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
                    lineHeight: 1.6,
                    padding: 0,
                    cursor: "pointer",
                  }}
                  onClick={()=>navigate(`/profile/${uid}`)}
                >
                  Other recipes of {name}
                </ListSubheader>
              }
            >
              {loadding ? (
                [1, 2].map((loader) => (
                  <div key={loader}>
                    <ListItem key={loader} />
                  </div>
                ))
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
                        {recipesList.length - 1 !== ind && <Divider />}
                      </div>
                    );
                  })}
                </>
              )}
            </List>
          </Paper>
        </motion.div>
      )}
    </>
  );
}
