import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextEncoder, TextDecoder });

import "@testing-library/jest-dom";
import { config } from "dotenv";

config();
