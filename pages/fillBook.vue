<template>
<div>
  <b-card bg-variant="light">
    <b-form-group
      label-cols-lg="3"
      label="Title"
      label-size="lg"
      label-class="font-weight-bold pt-0"
      class="mb-0"
    >
      <b-form-group
        label-cols-sm="3"
        label="Title:"
        label-align-sm="right"
        label-for="nested-title"
      >
        <b-form-input id="nested-title"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="Author:"
        label-align-sm="right"
        label-for="nested-author"
      >
        <b-form-input id="nested-author"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="Category:"
        label-align-sm="right"
        label-for="nested-category"
      >
        <b-form-input id="nested-category"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="Publisher:"
        label-align-sm="right"
        label-for="nested-publisher"
      >
        <b-form-input id="nested-publisher"></b-form-input>
      </b-form-group>

			<b-form-group
        label-cols-sm="3"
        label="Publish Date:"
        label-align-sm="right"
        label-for="nested-date"
      >
        <b-form-input id="nested-date" type="number"></b-form-input>
      </b-form-group>

			<b-form-group
        label-cols-sm="3"
        label="Synopsis:"
        label-align-sm="right"
        label-for="nested-synopsis"
      >
        <b-form-textarea
				id="nested-synopsis"
				placeholder="Enter something..."
				rows="3"
				max-rows="4"
    ></b-form-textarea>
      </b-form-group>

    </b-form-group>
			<b-button style="float:right;" class="mr-2" variant="success">Upload File</b-button>
  </b-card>
</div>
</template>
