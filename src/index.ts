#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createVideo, upload, videoToAudio } from "@cratecode/client";
import prompts from "prompts";
import * as fs from "fs";
import * as Path from "path";

yargs(hideBin(process.argv))
    .scriptName("Cratecode CLI")
    .usage("$0 <cmd> [args]")
    .command(
        "upload <manifest>",
        "Uploads a unit to Cratecode.",
        {
            key: {
                alias: "k",
                default: null,
                type: "string",
                describe: "The API key to use.",
            },
        },
        async (args) => {
            let key: string | null = args.key;
            if (!key) {
                key = (
                    await prompts({
                        type: "text",
                        name: "value",
                        message: "Please enter your API key:",
                    })
                ).value as string;
            }

            await upload(args.manifest as string, key);
        },
    )
    .command(
        "extract <video>",
        "Extracts an audio file from a video.",
        {
            output: {
                alias: "o",
                default: null,
                type: "string",
                describe:
                    "The file path to write the audio file to (it is in .ogg format).",
            },
            yes: {
                alias: "y",
                default: false,
                type: "boolean",
                describe: "Accept all potentially destructive actions.",
            },
        },
        async (args) => {
            if (!fs.existsSync(args.video as string)) {
                throw new Error("The specified video file does not exist!");
            }

            const output =
                args.output || Path.parse(args.video as string).name + ".ogg";

            // Make sure that the user knows that they're overriding a file.
            if (
                fs.existsSync(output) &&
                !args.yes &&
                !(
                    await prompts({
                        type: "confirm",
                        name: "value",
                        message:
                            'The file "' +
                            output +
                            '" already exists. Please confirm that you want to override it (Y/n):',
                    })
                ).value
            ) {
                return;
            }

            fs.writeFileSync(
                output,
                videoToAudio(fs.readFileSync(args.video as string)),
            );
            console.log('Wrote audio to "' + output + '".');
        },
    )
    .command(
        "combine <video> <audio>",
        "Inserts an audio file into a video file.",
        {
            output: {
                alias: "o",
                default: null,
                type: "string",
                describe:
                    "The file path to write the new video file to (it is in .cv format).",
            },
            yes: {
                alias: "y",
                default: false,
                type: "boolean",
                describe: "Accept all potentially destructive actions.",
            },
        },
        async (args) => {
            if (!fs.existsSync(args.video as string)) {
                throw new Error("The specified video file does not exist!");
            }
            if (!fs.existsSync(args.audio as string)) {
                throw new Error("The specified audio file does not exist!");
            }

            const output = args.output || (args.video as string);

            // Make sure that the user knows that they're overriding a file.
            if (
                fs.existsSync(output) &&
                !args.yes &&
                !(
                    await prompts({
                        type: "confirm",
                        name: "value",
                        message:
                            'The file "' +
                            output +
                            '" already exists. Please confirm that you want to override it (Y/n):',
                    })
                ).value
            ) {
                return;
            }

            fs.writeFileSync(
                output,
                createVideo(
                    fs.readFileSync(args.video as string),
                    fs.readFileSync(args.audio as string),
                ),
            );
            console.log('Wrote video with new audio to "' + output + '".');
        },
    )
    .showHelpOnFail(true)
    .help()
    .demandCommand().argv;
