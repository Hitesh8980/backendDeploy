const express =require('express');
const authorize = require('../middleware/authorize.middleware');
const bookmodel = require('../model/book.model');
const router = express.Router()



router.get('/view-book',authorize(['VIEW_ALL','CREATOR','VIEWER']),async(req,res)=>{
    try {
        const { old, new: isNew } = req.query;
        let query = {};
        if (!old && !isNew) {
            return res.status(400).json({ msg: 'Query parameter "old" or "new" is required.' });
        }

        if (old) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            query.createdat = { $lte: tenMinutesAgo };
        }

        if (isNew) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            query.createdat = { $gt: tenMinutesAgo };
        }
        console.log('Query object:', query);

        const books = await bookmodel.find(query);

        if (books.length === 0) {
            return res.status(404).json({ msg: 'No books found.' });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ msg:`Error creating book${error}` });
    }
});
router.post('/add-book',authorize(['CREATOR','VIEWER']),async(req,res)=>{
    const {title,author,description,}=req.body
    const userId=req.user.id
    try {
        if (!title) {
            return res.status(400).json({ msg: 'Book title is required.' });
        }

        const book=await bookmodel.findOne({title})
        if(book){
            return res.status(403).json({msg:'this book is already there in library'})
        }
        const newBook = new bookmodel({
            title,
            author,
            description,
            userId 
        });
        await newBook.save()

        return res.status(201).json(newBook);
    } catch (error) {
        return res.status(500).json({ msg: ` Error creating book${error}` });
    }
});
router.patch('/update-book/:id',authorize('CREATOR'),async(req,res)=>{
    const {id}=req.params
    try {
        const updatedata=req.body
        const updatedBook = await bookmodel.findByIdAndUpdate(id, updatedata, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ msg: 'Book not found.' });
        }
        res.status(200).json(updatedBook);
        
    } catch (error) {
        return res.status(500).json({ msg: 'Error updating book' });
    }
});
router.delete('/delete-book/:id',authorize('CREATOR'),async(req,res)=>{
    try {
        const { id } = req.params;

        const deletedBook = await bookmodel.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ msg: 'Book not found.' });
        }

        res.status(200).json({ msg: 'Book deleted successfully.' });
        
    } catch (error) {
        return res.status(500).json({ msg: 'Error deleting book' });   
    }
})
module.exports=router