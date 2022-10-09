# CLI

This is the CLI for [Cratecode](https://cratecode.com). It provides an interface for managing aspects of Cratecode involved during the creation of lessons/units.

## Features

The CLI can:

-   Upload lessons/units.
-   Extract audio from video files.
-   Replace audio inside of video files.

# Usage

## Uploading Units

To upload a unit use the `npx cratecode upload path/to/manifest.json` command. You'll need an API key, which you can get at https://cratecode.com/account (`API` tab).

### Creating Lessons/Units

Uploading works by creating a manifest file which imports other manifest files, and can also specify a unit to upload. This "root" manifest file commonly links to either subunits (which in turn link to lessons or other subunits) or lessons, which will be uploaded.

Instead of working with IDs directly, items are linked and mapped with "friendly names", which are human-readable identifiers that are only used during the uploading process. Instead of specifying an ID for a unit/project, specify a friendly name. If the item doesn't already exist, it will be created.

Units can reference lessons or other units. If you need to use someone else's unit/lesson, you can use their ID by starting the ID with a ":" and placing it in the friendly name field.

Unit manifest files contain the definition for the unit. That is, they include a starting lesson for the unit, and what lessons other lessons point to. They follow the following format:

```json
{
    "type": "unit",
    "id": "friendly_name",
    "name": "Display Name",
    "upload": ["folder1/manifest.json"],
    "lessons": {
        "first_lesson": {
            "next": ["next_lesson"]
        },
        "next_lesson": {
            "next": []
        }
    }
}
```

Where `id` is a friendly name/id for the unit, `name` is the display name for the unit, `upload` is a list of manifests that the unit depends on and which will be uploaded, and `lessons` is a list of every lesson included in the unit along with what lessons/units will come after them (`next`), optionally what lessons/units will come before them (`requires`), and optionally if every lesson/unit in `requires` must be completed for them to be available (`requireAll`).

For the root manifest (the one you specify in the upload command), a `templates` item can be specified which points to the templates directory. Every directory in the templates directory will be an available template, which lessons can extend (using their directory names) and use to provide default files.

Lesson manifest files include information about the lesson. They should be included in the directory containing the lesson's contents. For example, a lesson manifest might be in a folder that looks like:

```
folder/
-- index.js
-- manifest.json
-- README.md
```

During the uploading process, `manifest.json`, `config.json`, and `video.cv` will not be uploaded to the lesson files and will be treated separately. For a lesson manifest, the following format is used:

```json
{
    "type": "lesson",
    "id": "friendly_name",
    "name": "Display Name",
    "spec": null,
    "class": "tutorial"
}
```

Where `id` is a friendly name/id for the unit, `name` is the display name for the unit, `spec` is the specification for what the lesson's code should be, and `class` is the type of lesson (null, `tutorial`, `activity`, `project`, and `challenge`).

A typical setup might look like the below file tree, where the first manifest is the first example manifest and the second manifest is the second example manifest:

```
folder/
-- manifest.json
-- lessons/
   -- lesson_1/
      -- index.js
      -- manifest.json
      -- README.md
```

You may also subdivide your unit into multiple smaller units. In the example below, the first two manifests are unit manifests (like the first example manifest), while the second is a lesson manifest (like the second example manifest). In this example, the first manifest may upload the second manifest and link to the unit described by the second manifest, while the second manifest may upload the third and link to the lesson described by the third.

```
folder/
-- manifest.json
-- units/
   -- unit_1/
      -- manifest.json
      -- lessons/
         -- lesson_1/
            -- index.js
            -- manifest.json
            -- README.md
```

As you can see, many configurations are possible. To look at an actual example, please head over to the [Cratecode Intro](https://github.com/Cratecode/intro.git) repository.

## Manipulating Videos

You can use the CLI to modify a video's audio. Use the `npx cratecode extract path/to/video.cv` command to extract the audio file, modify it, then use the `npx cratecode combine path/to/video.cv path/to/audio.ogg` command to add the new audio to the video.
