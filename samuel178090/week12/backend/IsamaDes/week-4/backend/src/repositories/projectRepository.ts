import Project from "../models/Project.js";

export const projectRepository = {
    async create( title: string, description: string, createdBy?: string ){return await Project.create({title, description, createdBy}) },
     findById(id: string){ return Project.findById(id) },
    async findByName(name: string){return await Project.findOne({title: name})},
    async getAll(){
        return await Project.find().populate("createdBy", "name").populate("comments.user", "name");
    },
    async save(project: any) {
   const saved = await project.save();
   return await saved.populate(
     "comments.user", "name" ,
  );
}
}