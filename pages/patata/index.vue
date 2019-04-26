<template>
    <div>
    <h1>Me comes la patata</h1>
    <p>Y si no te apetece, me da igual. Te la vas a comer de todas formas.</p>
    <form action="http://localhost:3003/book/uploadBook" method="post" enctype="multipart/form-data">
        <input type="file" name="book" />
        <input type="submit" value="Upload" />
    </form>
    </div>
</template>