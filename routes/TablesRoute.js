import { Router } from "express";
// import { createTable, read, update, delete: del } from('../controller/tableController');
import {createTables} from '../controller/tableController.js'
const router = Router()
router.get('/createTables', createTables)
export default router