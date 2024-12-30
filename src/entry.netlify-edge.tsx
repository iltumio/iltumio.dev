/*
 * WHAT IS THIS FILE?
 *
 * It's the  entry point for netlify-edge when building for production.
 *
 * Learn more about the cloudflare integration here:
 * - https://qwik.builder.io/deployments/netlify-edge/
 *
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/netlify-edge";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";

export default createQwikCity({ render, qwikCityPlan, manifest });
