import express from "express";

import { 
    changePlan
} from "../controllers/usuario.controller.js";

const router = express.Router();

router.patch("/change-plan", changePlan);

export default router;