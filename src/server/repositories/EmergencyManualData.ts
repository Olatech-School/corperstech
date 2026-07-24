import { EMERGENCY_MANUAL_PART_1 } from "./EmergencyManualPart1.ts";
import { EMERGENCY_MANUAL_PART_2 } from "./EmergencyManualPart2.ts";
import { EMERGENCY_MANUAL_PART_3 } from "./EmergencyManualPart3.ts";
import { EMERGENCY_MANUAL_PART_4 } from "./EmergencyManualPart4.ts";
import { EMERGENCY_MANUAL_PART_5 } from "./EmergencyManualPart5.ts";
import { EMERGENCY_MANUAL_PART_6 } from "./EmergencyManualPart6.ts";

export const EMERGENCY_SOP_MANUAL_CONTENT = [
  EMERGENCY_MANUAL_PART_1,
  EMERGENCY_MANUAL_PART_2,
  EMERGENCY_MANUAL_PART_3,
  EMERGENCY_MANUAL_PART_4,
  EMERGENCY_MANUAL_PART_5,
  EMERGENCY_MANUAL_PART_6
].join("\n\n");
