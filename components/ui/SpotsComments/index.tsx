'use client';

import Image from 'next/image';

const CommentsSection = ({ comments }: {comments: any[]}) => {
    if(comments.length == 0) return null;
  return (
    <section className="container bg-white rounded-2xl p-6 lg:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">Avaliações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comments?.map((comment, index) => (
          <div key={index} className="flex gap-4 p-4 border rounded-lg">
            <Image
              src={comment.userImage || '/default-avatar.jpg'}
              alt={comment.userName}
              width={50}
              height={50}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{comment.userName}</p>
              <p className="text-gray-600 text-sm">
                {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-gray-700 mt-2">{comment.comment}</p>
              <a href="#" className="text-blue-600 font-medium mt-2 block">
                Mostrar mais
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentsSection;
